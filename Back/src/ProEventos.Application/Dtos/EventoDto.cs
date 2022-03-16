using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ProEventos.Application.Dtos;

namespace Back.src.ProEventos.Aplication.Dtos
{

    public class EventoDto{
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório."),
         //MinLength(3, ErrorMessage = "O campo {0} deve ter no míniimo 4 caracteres"),
         //MaxLength(50, ErrorMessage = "O campo {0} deve ter no máximo 50 caracteres")
         StringLength(50, MinimumLength = 3,
                          ErrorMessage = "Intervalo Permitido de 3 a 50 caracteres")
         ] 
        public string Tema { get; set; }


        [Display(Name = "QtdPessoas")]
        [Range(1,120000, ErrorMessage ="{0} não pode ser menor do que 1 e maior do que 120.000")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",
                ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp ou png)")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]    
        [Phone(ErrorMessage = "O campo {0} está com o número inválido")]
        public string Telefone { get; set; } 

        [Display(Name = "e-mail"),
            Required(ErrorMessage = "O campo {0} é obrigatório"),
            EmailAddress(ErrorMessage = "É necessário ser um {0} válido")
        ]
        public string Email { get; set; }

        public int UserId { get; set; }
        
        public UserDto UserDto { get; set; }
        
        public IEnumerable<LoteDto> Lotes { get; set; }     
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }

        public IEnumerable<PalestranteDto> Palestrantes { get; set; }

    }


}