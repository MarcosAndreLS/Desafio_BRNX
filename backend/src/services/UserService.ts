// services/UserService.ts
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export class UserService {

  async listConsultors() {
    return userRepository.findAllConsultors();
  }
}