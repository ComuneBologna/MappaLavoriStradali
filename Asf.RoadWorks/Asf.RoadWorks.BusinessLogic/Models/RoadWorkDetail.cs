using Asf.RoadWorks.DataAccessLayer.Entities;
using SmartTech.Infrastructure.Maps;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Road work detail class
	/// </summary>
	/// <seealso cref="Asf.RoadWorks.BusinessLogic.Models.RoadWorkBase" />
	public sealed class RoadWorkDetail : RoadWorkBaseExtended
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long Id { get; set; }

		/// <summary>
		/// Gets or sets the publish status.
		/// </summary>
		/// <value>
		/// The publish status.
		/// </value>
		public PublishStatus? PublishStatus { get; set; }

		/// <summary>
		/// Gets or sets the address point from.
		/// </summary>
		/// <value>
		/// The address point from.
		/// </value>
		public MapCoordinate AddressPointFrom { get; set; }

		/// <summary>
		/// Gets or sets the address point to.
		/// </summary>
		/// <value>
		/// The address point to.
		/// </value>
		public MapCoordinate AddressPointTo { get; set; }

		/// <summary>
		/// Gets or sets the geo feature container.
		/// </summary>
		/// <value>
		/// The geo feature container.
		/// </value>
		public string GeoFeatureContainer { get; set; }

		/// <summary>
		/// Gets or sets the neighborhood.
		/// </summary>
		/// <value>
		/// The neighborhood.
		/// </value>
		public IEnumerable<string> Neighborhoods { get; set; }

		/// <summary>
		/// Gets or sets the roadways.
		/// </summary>
		/// <value>
		/// The roadways.
		/// </value>
		public IEnumerable<Roadway> Roadways { get; set; }

		/// <summary>
		/// Gets or sets the section.
		/// </summary>
		/// <value>
		/// The section.
		/// </value>
		public IEnumerable<MapCoordinate> Section { get; set; }

		/// <summary>
		/// Gets or sets the pin point.
		/// </summary>
		/// <value>
		/// The pin point.
		/// </value>
		public MapCoordinate PinPoint { get; set; }

		/// <summary>
		/// Gets or sets the attachments.
		/// </summary>
		/// <value>
		/// The attachments.
		/// </value>
		public IEnumerable<RoadWorkAttachmentBase> Attachments { get; set; }

		/// <summary>
		/// Gets or sets the status.
		/// </summary>
		/// <value>
		/// The status.
		/// </value>
		public RoadWorkStatus? Status { get; set; }
	}
}