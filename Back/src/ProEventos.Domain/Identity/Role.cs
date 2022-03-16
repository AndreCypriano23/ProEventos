using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ProEventos.Domain.Identity
{
    public class Role : IdentityRole<int>
    {
        //É uma associação de responsabilidade
        public List<UserRole> UserRoles { get; set; } 
        
    }
}