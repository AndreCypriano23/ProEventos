namespace ProEventos.API.Models
{
    public class PaginationHeader
    {
        public PaginationHeader(int currentPage, int itemsPerPage, int totalItens, int totalPages)
        {
            this.CurrentPage = currentPage;
            this.ItemsPerPage = itemsPerPage;
            this.TotalItens = totalItens;
            this.TotalPages = totalPages;
        }
        
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItens { get; set; }
        public int TotalPages { get; set; }

    }
}