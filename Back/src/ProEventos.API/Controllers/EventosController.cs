using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using Back.src.ProEventos.Aplication.Dtos;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        
        private readonly IEventoService _eventoService;
        public readonly IWebHostEnvironment _hostEnvironment;
        public readonly IAccountService _accountService;

        public EventosController(IEventoService eventoService,
                                 IWebHostEnvironment hostEnvironment,
                                 IAccountService accountService)//Injeção de dependencia, vc tem que colocar uma interface mesmo
        {
            _eventoService = eventoService;
            _hostEnvironment = hostEnvironment;
            _accountService = accountService;
        }

        //Isso é uma rota
        [HttpGet]
        //IActionResult é bom pq ele resulta o status code do http, 404, 200, 500, 300
        public async Task<IActionResult> Get()
        {
            try 
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), true);//quando bater nessa linha, ele TEM QUE TER O TOKEN, SENAO ELE NAO PODE BATER NESSA LINHA

                if(eventos ==  null) return NoContent();  
                            
                //usando dto quem está consumindo nao tem noção dos outros campos, ele nao tem acesso direto ao meu domínio
                return Ok(eventos);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try 
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if(evento ==  null) return NoContent();

                return Ok(evento);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("{tema}/tema")]
        public async Task<IActionResult> GetByTema(string tema)
        {
            try 
            {
                var evento = await _eventoService.GetAllEventosByTemaAsync(User.GetUserId(), tema, true);
                if(evento ==  null) return NoContent();

                return Ok(evento);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }


        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId)
        {
            try 
            {
                
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId,true);
                if(evento ==  null) return NoContent(); 


                //já que ele existe
                var file =  Request.Form.Files[0];
                if(file.Length > 0)
                {
                    //deletar foto antiga
                    DeleteImage(evento.ImagemURL);
                    //salvar foto nova, alterei o nome da imagem
                     evento.ImagemURL = await SaveImage(file);
                
                }
                //retorno o evento com a imagem alterada
                var EventoRetorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);
                
                return Ok(EventoRetorno);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar adicionar eventos. Erro: {ex.Message}");
            }
        }



        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try 
            {
                var evento = await _eventoService.AddEventos(User.GetUserId(), model);
                if(evento ==  null) return NoContent(); 
                
                return Ok(evento);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar adicionar eventos. Erro: {ex.Message}");
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try 
            {
                var evento = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
                if(evento ==  null) return NoContent();   

                return Ok(evento);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar atualizar eventos. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try 
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if(evento ==  null) return NoContent();

                if(await _eventoService.DeleteEvento(User.GetUserId(), id))
                {
                    DeleteImage(evento.ImagemURL);
                    return Ok(new { message = "Deletado" });
                }
                else
                {
                     throw new Exception("Ocorreu um problema não específico ao tentar deletar o Evento.");
                } 

            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar deletar o evento. Erro: {ex.Message}");
            }
            
        }

        [NonAction]
        //Não é um endpoint, esse método nao vai poder ser acessado de fora
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
            .Take(10)
            .ToArray()
            ).Replace(' ', '-');//pegar o nome da imagem, uso o take para pegar os 10 primeiros nomes apenas

            // pega o nome da imagem e concatena com a data e a extensão
            imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
            
            //Agora salvo a imagem
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imageName);

            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }

        [NonAction]     
        public void DeleteImage(string imageName)
        {
            //O ContentRootPath pega o meu caminho atual(raiz) e concatenei com o meu diretório que criei para as fotos
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imageName);
            if(System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            } 
        }

    }
}
