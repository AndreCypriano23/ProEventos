using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;

namespace ProEventos.Application
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config, 
                            UserManager<User> userManager,
                            IMapper mapper)
        {
            _config = config;
            _userManager = userManager;
            _mapper = mapper;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])); //quando eu crio um Token, eu preciso de uma chave de verificação do token
        }
        public async Task<string> CreateToken(UserUpdateDto userUpdateDto)
        {
            var user = _mapper.Map<User>(userUpdateDto);

            //vou criar minhas clams, o que são clams? afirmações, ex, na minha carteira
            // de identidade existe várias afirmações sobre mim
            //Clams nao estao relacionadas ao Identity, e sim do próprio System do .Net

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            //vamos retornar as roles que o usuário tem no token role é função
            var roles = await _userManager.GetRolesAsync(user);//aqui eu vou buscar a administração do meu usuário, se ele for adm, moderador, vendedor, aluno, professor

            //se ele for admin, professor e moderador ao mesmo tempo, ele vai adicionar aqui abaixo as roles no claim
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));//dado cada role dentro de roles
             
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //para usar o Security Token Descriptor temos que instalar mais um cara, que é
            // o Microsoft.IdentityModel.Token 
            var tokenDescription = new SecurityTokenDescriptor
            {
              
                Subject = new ClaimsIdentity(claims),//claims que foram criadas, 
                Expires = DateTime.Now.AddDays(1), //quando o Token Expira
                SigningCredentials = creds //creds 

            };

            //retornar o Token
            //o System.IdentityModel.Tokens.JWT  tive que instalar esse pacote nugget    
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescription);

            return tokenHandler.WriteToken(token);
            
        }

    }
}