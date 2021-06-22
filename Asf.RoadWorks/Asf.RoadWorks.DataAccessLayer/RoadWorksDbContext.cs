using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace Asf.RoadWorks.DataAccessLayer
{
	public class RoadWorksDbContext : DbContext
	{
		public RoadWorksDbContext(DbContextOptions<RoadWorksDbContext> options) : base(options)
		{
		}

		public DbSet<RoadWorkAuditEntity> AuditWorks { get; set; }

		public DbSet<RoadwayEntity> Roadways { get; set; }

		public DbSet<RoadWorkEntity> Works { get; set; }

		public DbSet<CompanyEntity> Companies { get; set; }

		public DbSet<RoleUserEntity> Users { get; set; }

		public DbSet<ConfigurationEntity> Configurations { get; set; }

		public DbSet<RoadWorkAttachmentEntity> Attachments { get; set; }

		public DbSet<ImportLogEntity> ImportLogs { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<RoadWorksRoadwayEntity>()
				.HasKey(sr => new { sr.RoadWorkId, sr.RoadwayId });

			modelBuilder.Entity<RoadWorksRoadwayEntity>()
				.HasOne(sr => sr.RoadWork)
				.WithMany(s => s.RoadWays)
				.HasForeignKey(sr => sr.RoadWorkId);

			modelBuilder.Entity<RoadWorksRoadwayEntity>()
				.HasOne(sr => sr.Roadway)
				.WithMany(r => r.RoadWorksRoadways)
				.HasForeignKey(sr => sr.RoadwayId);

			modelBuilder.Entity<RoleUserEntity>()
				.HasKey(sr => new { sr.AuthorityId, sr.UserId });
		}
	}
}