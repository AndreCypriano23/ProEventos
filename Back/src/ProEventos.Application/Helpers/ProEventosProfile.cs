using AutoMapper;
using Back.src.ProEventos.Aplication.Dtos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace Back.src.ProEventos.Aplication.Helpers
{
    public class ProEventosProfile : Profile
    {   
        public ProEventosProfile()
        {
            CreateMap<Evento, EventoDto>().ReverseMap();//Mapeie tudo de Evento para Evento Dto e ao contrário usando o ReverseMap()
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Palestrante, PalestranteDto>().ReverseMap();

             CreateMap<User, UserDto>().ReverseMap();
             CreateMap<User, UserLoginDto>().ReverseMap();
             CreateMap<User, UserUpdateDto>().ReverseMap();
             
        }
    }
}