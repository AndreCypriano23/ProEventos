using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ProEventos.Persistence.paginacao
{
    public class PageList<T> : List<T>
    {
        //Essa classe serve para que? Essa classe vai ser o pontapé inicial
        //para tudo que eu for fazer, ele vai me retornar 4 valores essenciais

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }


        public PageList()
        {
            
        }

        //Essas props serão utilizadas quando eu setar um parametro
        public PageList(List<T> items, int count, int PageNumber, int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = PageNumber;//o page number é a página inicial
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            //o Add Range vem da lista
            AddRange(items);
            //Esses items que vou colocar no Range sao os items que virão no parametro
            //Se eu tiver um select que retornou vários eventos, eu vou passar esses eventos
            //aqui como primeiro parâmetro  
        }

        //Isso é ligeralmente complexo
        public static async Task<PageList<T>> CreateAsync(
            IQueryable<T> source, int pageNumber, int pageSize)
        {   
             //O count é o seu source que vc vai contar quantos itens tem dentro, tipo 
            //meu evento tem 6 items.
            var count = await source.CountAsync();

            //quais sao os meus items? O Skip é para pular
            var items = await source.Skip((pageNumber-1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();
            //É pageNumber(número da página onde estou -1 pq ele começa a contar de zero, ex: pag 1 na vdd ele tem 
            //que falar que é a página zero, PARA o usuário é a pag 2 mas p/ o Array é a Pag 1.
            //e X pageSize seria: vou pular aquela quanidade de páginas
            //ex: na pag 1 eu tenho 3 itens se o pageSize for 3 eu tenho que pular 6 itens p/ ir para a página 3
            //Aí eu pego o pageSize e dou um list. Se ele está na pág 2 e pula 3 intens, ENTAO ELE VAI
            //PEGAR OS PRÓXIMOS 3(TAKE)

            return new PageList<T>(items, count, pageNumber, pageSize);
        }
    }

}