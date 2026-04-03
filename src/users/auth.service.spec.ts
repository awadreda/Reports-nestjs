import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { async } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      findByEmail: (email: string) => {
        const user = { id: 1, email: 'a@com.com', password: '123' } as User;
        // const user = users.find((u) => u.email === email);
        return Promise.resolve(user || null);
      },

      create: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 1,
          email: createUserDto.email,
          password: createUserDto.password,
        } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of  auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with  a salted and hashed  password', async () => {
    const user = await service.singUp({
      email: 'asd@lol.com',
      password: '1234',
    });

    expect(user.password).not.toEqual('1234');
    expect(user.password).toContain('.');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
    expect(salt.length).toBeGreaterThan(0);
    expect(hash.length).toBeGreaterThan(0);
  });

  // it('throws an error if user signs up with email that is in use', async (done) => {
  //   fakeUsersService.findByEmail = (email: string) => {
  //     const users = { id: 1, email, password: '123' } as User;
  //     // const user = users.find((u) => u.email === email);
  //     return Promise.resolve(users);

  //   };

  //   try{

  //    await service.singUp({ email: 'aw@a.com', password: '123' })
  //   }
  //   catch(err) {
  //     done();
  //   }

  // });

  it('throws if sigin is called with an unused email', async (done) => {
    try {
      await service.singin({ email: 'asd@efa.com', password: '12345' });
    } catch (err) {
      done();
    }
  });
});
