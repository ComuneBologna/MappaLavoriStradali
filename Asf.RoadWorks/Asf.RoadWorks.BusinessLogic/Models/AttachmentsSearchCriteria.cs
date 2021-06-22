using SmartTech.Infrastructure.Search;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Attachment search criteria model
	/// </summary>
	/// <seealso cref="Asf.PublicApps.Infrastructure.Models.SearchCriteria{Asf.RoadWorks.BusinessLogic.Models.RoadWorkAttachmentInfo}" />
	public class AttachmentsSearchCriteria : FilterCriteria
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long? Id { get; set; }

		/// <summary>
		/// Gets or sets the work identifier.
		/// </summary>
		/// <value>
		/// The work identifier.
		/// </value>
		public long? RoadworkId { get; set; }

		/// <summary>
		/// Gets or sets the name.
		/// </summary>
		/// <value>
		/// The name.
		/// </value>
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets the is public.
		/// </summary>
		/// <value>
		/// The is public.
		/// </value>
		public bool? IsPublic { get; set; }
	}
}