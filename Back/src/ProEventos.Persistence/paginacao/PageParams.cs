namespace ProEventos.Persistence.paginacao
{
    public class PageParams
    {
        public const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        //essa tem get e set 
        public int pageSize = 10;
        public int PageSize 
        {

             get { return pageSize;} 
             set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        //filtro
        //tema
        public string Term { get; set; } = string.Empty;//toda vez que nao tiver info para termo(ou nenhum parametro) ele será empty e nao NULO
        //pesquisa pelo termo: tema ou local, aí vamos usar ele para ambos

    }
}