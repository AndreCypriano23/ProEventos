export class Pagination {
  //tem que estar o mesmo nome que está no back
  currentPage: number;
  itemsPerPage: number;
  totalItens: number;
  totalPages: number;

}

export class PaginatedResult<T>{
  result: T;//Posso paginar qq coisa, evento, lote
  pagination: Pagination;// que é do tipo do cara de cima

}
