using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Companies", Schema = Schemas.RoadWorks)]
	public class CompanyEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		[Required]
		public long AuthorityId { get; set; }

		[Required]
		public string Name { get; set; }

		[Required]
		public bool IsOperationalUnit { get; set; }

		public ICollection<RoadWorkEntity> Works { get; set; }

		public ICollection<RoleUserEntity> Users { get; set; }
	}
}