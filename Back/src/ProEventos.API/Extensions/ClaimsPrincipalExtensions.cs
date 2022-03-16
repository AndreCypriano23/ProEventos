using System.Security.Claims;

namespace ProEventos.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
          //Toda vez que vc for criar um método de extensão, a sua classe tbm tem que ser estática
          //SE NAO COLOCAR A CLASSE COMO STATIC vc nao vai conseguir chamar o método
           return  user.FindFirst(ClaimTypes.Name)?.Value;//se for diferente de nulo eu quero que pegue o Value
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
           return  int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);//se for diferente de nulo eu quero que pegue o Value
        }

    }
}