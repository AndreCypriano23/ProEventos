using Microsoft.AspNetCore.Identity;

namespace ProEventos.Domain.Identity
{
    public class UserRole : IdentityUserRole<int>
    {
        //Toda vez que eu criar um USER, eu vou criar uma ROLE
        public User User { get; set; }
        public Role Role { get; set; }
        
    }
}