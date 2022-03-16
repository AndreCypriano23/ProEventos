using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext :  IdentityDbContext<User, Role, int,
     IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
      IdentityRoleClaim<int>, IdentityUserToken<int>>

    {
        public ProEventosContext(DbContextOptions<ProEventosContext> options) 
           : base(options){}
        public DbSet<Evento> Eventos { get; set; } 
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<Palestrante> Palestrantes { get; set; }
        public DbSet<PalestranteEvento> PalestranteEventos { get; set; }
        public DbSet<RedeSocial> RedeSociais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //preciso fazer isso, usando o bas, passando o modelBuilder 
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                userRole.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();//nao posso criar uma referencia entre o User e o Role, se eu nao tiver o ID da minha Role
            
               userRole.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();//toda vez que cri um usuario dentro de UserROles, eu preciso tbm passar um userId
            
            }
            ); 




            modelBuilder.Entity<PalestranteEvento>()
            .HasKey(PE => new {PE.EventoId, PE.PalestranteId});
            //Ids externos que estão dentro de palestrante que vão criar O relacionamento entre o meu evento e o meu palestrante
       

            //O Evento tem muitas redes sociais
            //E UMA REDE SOCIAL TEM APENAS UM EVENTO
            modelBuilder.Entity<Evento>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Evento)
                .OnDelete(DeleteBehavior.Cascade);//Deletou o evento que possui rede
                //social, eu quero que vc faça de forma cascateada, ou seja, deletou o evento, deletou a rede social
              
              //O mesmo fiz para o palestrante
               modelBuilder.Entity<Palestrante>()
                .HasMany(e => e.RedesSociais)
                .WithOne(rs => rs.Palestrante)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}