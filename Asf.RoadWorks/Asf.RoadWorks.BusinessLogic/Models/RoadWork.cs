using Asf.RoadWorks.DataAccessLayer.Entities;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Road work class
	/// </summary>
	/// <seealso cref="Asf.RoadWorks.BusinessLogic.Models.RoadWorkBase" />
	public class RoadWork : RoadWorkBaseExtended
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long Id { get; set; }

		/// <summary>
		/// Gets or sets the roadways.
		/// </summary>
		/// <value>
		/// The roadways.
		/// </value>
		public IEnumerable<string> Roadways { get; set; }

		/// <summary>
		/// Gets or sets the Company name.
		/// </summary>
		/// <value>
		/// The Company name.
		/// </value>
		public string CompanyName { get; set; }

		/// <summary>
		/// Gets or sets the neighborhood.
		/// </summary>
		/// <value>
		/// The neighborhood.
		/// </value>
		public IEnumerable<string> Neighborhoods { get; set; }

		/// <summary>
		/// Gets or sets the publish status.
		/// </summary>
		/// <value>
		/// The publish status.
		/// </value>
		public PublishStatus? PublishStatus { get; set; }

		/// <summary>
		/// Gets or sets the status.
		/// </summary>
		/// <value>
		/// The status.
		/// </value>
		public RoadWorkStatus? Status { get; set; }
	}
}