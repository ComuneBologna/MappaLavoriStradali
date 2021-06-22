using Asf.RoadWorks.DataAccessLayer.Entities;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class RoadWorkUpdate : RoadWorkWrite
	{
		/// <summary>
		/// Gets or sets the publish status.
		/// </summary>
		/// <value>
		/// The publish status.
		/// </value>
		public PublishStatus PublishStatus { get; set; }
	}
}