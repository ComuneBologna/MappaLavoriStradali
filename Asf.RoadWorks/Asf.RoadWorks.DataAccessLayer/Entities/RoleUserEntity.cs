using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("RolesForUsers", Schema = Schemas.Security)]
	public class RoleUserEntity
	{
		public Guid UserId { get; set; }

		[Required]
		public long AuthorityId { get; set; }

		public long? CompanyId { get; set; }

		[Required]
		public string RoleCode { get; set; }

		[ForeignKey(nameof(CompanyId))]
		public CompanyEntity Company { get; set; }
	}
}