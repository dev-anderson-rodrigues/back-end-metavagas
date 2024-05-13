import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from 'src/Database/entities';
import { CreateVacancyDto } from 'src/auth/Config';
import { CompanyService } from 'src/companys/company.service';
import { UsersService } from 'src/users';
import { Repository } from 'typeorm';

@Injectable()
export class VacancyService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    private readonly companyService: CompanyService,
    private readonly advertiserService: UsersService,
  ) {}
  async createVacancy(data: CreateVacancyDto) {
    try {
      if (await this.vacancyExists(data.vacancyRole)) {
        throw new BadRequestException(
          `A vacancy with this name: ${data.vacancyRole} already exists.`,
        );
      }
      try {
        await this.companyService.idPicker(+data.companyId);
      } catch (e) {
        throw new BadRequestException(
          `A company with this id: ${data.companyId} does not exist.`,
        );
      }

      try {
        await this.advertiserService.getUserById(+data.advertiserId);
      } catch (e) {
        throw new BadRequestException(
          `ID: ${data.advertiserId} advertiser does not exist.`,
        );
      }

      const newVacancy = this.vacancyRepository.create(data);

      await this.vacancyRepository.save(newVacancy);

      return newVacancy;
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, error.status);
    }
  }

  // async findListVacancies() {
  //   try {
  //     return await this.vacancyRepository.find({
  //       relations: { advertiser: true, company: true, technologies: true },
  //     });
  //   } catch (err) {
  //     console.log(err);

  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
  async vacancyExists(vacancyRole: string): Promise<boolean> {
    const vacancy = await this.vacancyRepository.exists({
      where: { vacancyRole },
    });
    if (vacancy) {
      return true;
    } else {
      return false;
    }
  }
  async update(id: number, updateVacancyDto) {
    try {
      await this.getVacancyById(+id);

      await this.vacancyRepository.update(id, updateVacancyDto);

      return await this.getVacancyById(+id);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getVacancyById(id: number) {
    try {
      const vacancy = await this.vacancyRepository.findOne({ where: { id } });
      if (!vacancy) {
        throw new NotFoundException(`vacancy not located.`);
      }
      return vacancy;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: number) {
    try {
      await this.getVacancyById(id);

      await this.vacancyRepository.softDelete(id);

      return { response: 'Vacancy deleted with success.' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async searchVacancies(
    tecName: string,
    vacancyRole: string,
    minSalary: number,
    maxSalary: number,
    vacancyType: string,
    location: string,
    page = 1,
    limit = 10,
  ): Promise<{ vacancies: Vacancy[]; total: number }> {
    const query = this.vacancyRepository.createQueryBuilder('vacancy');
    query.leftJoinAndSelect('vacancy.technologies', 'technology');
    if (tecName) {
      query.where(
        'vacancy.vacancyRole || vacancy.vacancyDescription ILIKE :tecName',
        { tecName: `%${tecName}%` },
      );
      query.orWhere('technology.tecName ILIKE :tecName', {
        tecName: `%${tecName}%`,
      });
    }
    if (vacancyRole) {
      query.andWhere('vacancy.vacancyRole ILIKE :vacancyRole', {
        vacancyRole: `%${vacancyRole}%`,
      });
      console.log(vacancyRole);
    }
    if (minSalary) {
      query.andWhere('vacancy.wage >= :minSalary', { minSalary });
    }
    if (maxSalary) {
      query.andWhere('vacancy.wage <= :maxSalary', { maxSalary });
    }
    if (vacancyType) {
      query.andWhere('vacancy.vacancyType LIKE :vacancyType', {
        vacancyType: `%${vacancyType}%`,
      });
    }
    if (location) {
      query.andWhere('vacancy.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    const [vacancies, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { vacancies, total };
  }
}
