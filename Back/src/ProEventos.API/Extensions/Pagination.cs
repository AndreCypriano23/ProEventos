using System;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using ProEventos.API.Models;

namespace ProEventos.API.Extensions
{
    public static class Pagination //classe de extensão é sempre static
    {
        public static void AddPagination(this HttpResponse response,
            int currentPage, int itemsPerPage, int totalItems, int totalPages
        )
        {   
            var pagination = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages); 

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(pagination
                , options
            ));

            //Tem que fazer isso para expor a paginação
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}