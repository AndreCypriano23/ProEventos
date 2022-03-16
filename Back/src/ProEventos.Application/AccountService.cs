using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class AccountService : IAccountService
    {
        //O UserManager é do Identity
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly  IMapper _mapper;
        private readonly  IUserPersist _userPersist;

        public AccountService(UserManager<User> userManager,
                             SignInManager<User> signInManager,
                             IMapper mapper,
                             IUserPersist userPersist)
        {
            _userManager = userManager;
            _signInManager=  signInManager;
            _mapper = mapper;
            _userPersist = userPersist;

        }
        public async Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password)
        {
            //O useManager consegue chamar os nosso users
            try
            {
              var user = await _userManager.Users.SingleOrDefaultAsync(user => 
                    user.UserName == userUpdateDto.UserName.ToLower()); 

            //ele vai checar se o user ejncontrado ali em cima corresponde ao password,
               return await _signInManager.CheckPasswordSignInAsync(user, password, false);//se o password nao for igual ao user ele já bloqueia      
            }
            catch(System.Exception ex)
            {
                throw new Exception($" Erro ao tentar verificar password. Erro:{ex.Message}");
            } 
            throw new System.NotImplementedException();
        }

        public async Task<UserDto> CreateAccountAsync(UserDto userDto)
        {
            try
            {
                var user = _mapper.Map<User>(userDto);//vou mapear o userDto que vem do front, e aí vou MAPEAR PARA O USER
                var result = await _userManager.CreateAsync(user, userDto.Password);

                //O legal de usar o useManager é que ele já verifica se deu certo ou nao 
                if(result.Succeeded)
                {
                    //deu certo, entao vao mapear denovo, ao contrário
                    var userToReturn = _mapper.Map<UserDto>(user);
                    //veja lá no nome do método, no 'async Task<UserDto>', nao vai retornar um UserDto? 
                    //entao, tem que retornar ele, por isso que mapeamos de volta
                    //assim eu nao vou expor para a minha API o meu domínio a API só sabe o que está dentro do meu aplication
                    return userToReturn;
                }

                return null;

            }
            catch(System.Exception ex)
            {
                throw new Exception($" Erro ao tentar criar Usuário. Erro:{ex.Message}");
            } 
            throw new System.NotImplementedException();
        }

        public async Task<UserUpdateDto> GetUserByUserNameAsync(string userName)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(userName);
                if(user == null) return null; 

                var userUpdateDto = _mapper.Map<UserUpdateDto>(user);
                return userUpdateDto;

            }
            catch(System.Exception ex)
            {
                throw new Exception($" Erro ao tentar pegar Usuário por UserName. Erro:{ex.Message}");
            } 
            throw new System.NotImplementedException();
        }

        public async Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            try
            {
                //QUANDO a gente atualiza usuário, a gente também atualiza senha
                var user = await _userPersist.GetUserByUserNameAsync(userUpdateDto.UserName);
                if(user == null) return null;

                //Se eu encontro eu mapeio ele com o userUpdateDto, entao o user fica com tudo do userUpdateDto
                _mapper.Map(userUpdateDto, user);

                //A primeira coisa que tenho que fazer antes de atualizar é dar um reset no password
               
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, userUpdateDto.Password);

                _userPersist.Update<User>(user);

                if(await _userPersist.SaveChangesAsync())
                {
                    var userRetorno = await _userPersist.GetUserByUserNameAsync(user.UserName);
                    //eu peguei o retorno do Token e envio para o usuário
                    return _mapper.Map<UserUpdateDto>(userRetorno);
                }

                return null;              
            }
            catch(System.Exception ex)
            {
                throw new Exception($" Erro ao tentar verificar password. Erro:{ex.Message}");
            } 
            throw new System.NotImplementedException();
        }

        public async Task<bool> UserExists(string username)
        {
            try
            {
                return await _userManager.Users.
                    AnyAsync(user => user.UserName == username.ToLower());//O AnyAsync é do Entity Frameworl core. Nele vc nao precisar fazer um count, ele é mais eficiente

            }
            catch(System.Exception ex)
            {
                throw new Exception($" Erro ao tentar verificar se o usuário existe. Erro:{ex.Message}");
            } 
            throw new System.NotImplementedException();
        }
    }
}