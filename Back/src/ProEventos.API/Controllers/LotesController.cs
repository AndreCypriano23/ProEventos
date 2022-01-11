using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using Back.src.ProEventos.Aplication.Dtos;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotesController : ControllerBase
    {
        
        private readonly ILoteService _loteService;

        public LotesController(ILoteService loteService)//Injeção de dependencia, vc tem que colocar uma interface mesmo
        {
            _loteService = loteService;
        }

  
        [HttpGet("{eventoId}")]//Nós vamos chamar os lotes sempre por meio de um EventoId
        //todos os lotes para existirem precisam estar dentro de um evento
        public async Task<IActionResult> Get(int eventoId)
        {
            try 
            {
                var lotes = await _loteService.GetLotesByEventoIdAsync(eventoId);
                if(lotes ==  null) return NoContent();  
                              
                return Ok(lotes);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar recuperar os lotes. Erro: {ex.Message}");
            }

        }

        [HttpPut("{eventoId}")]
        public async Task<IActionResult> SaveLotes(int eventoId, LoteDto[] models)
        {
            try 
            {
                var lote = await _loteService.SaveLotes(eventoId, models);
                if(lote ==  null) return NoContent();   

                return Ok(lote);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar salvar os lotes. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{eventoId}/{loteId}")]
        public async Task<IActionResult> Delete(int eventoId, int loteId)
        {
            try 
            {
                var lote = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
                if(lote ==  null) return NoContent();

                return await _loteService.DeleteLote(lote.EventoId, lote.Id) 
                    ? Ok(new { message = "Lote Deletado" })
                    : throw new Exception("Ocorreu um problema não específico ao tentar deletar o Lote.");

            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao tentar deletar os lotes. Erro: {ex.Message}");
            }
            
        }

    }
}
