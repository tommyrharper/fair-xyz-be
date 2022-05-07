import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: EntityRepository<Student>,
  ) {}

  async createStudent(name, email, age): Promise<Student> {
    const student = this.studentsRepository.create({
      id: 'some-random-id',
      name,
      email,
      age,
    });

    this.studentsRepository.persistAndFlush(student);
    return student;
  }
}
