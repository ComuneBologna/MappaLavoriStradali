using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Roadways", Schema = Schemas.RoadWorks)]
	public class RoadwayEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public short Id { get; set; }

		[Required]
		public string Name { get; set; }

		public ICollection<RoadWorksRoadwayEntity> RoadWorksRoadways { get; set; }
	}
}