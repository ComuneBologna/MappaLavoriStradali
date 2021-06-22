using SmartTech.Infrastructure.Search;
using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Configuration search criteria class
	/// </summary>
	public class ConfigurationSearchCriteria : FilterCriteria
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long? Id { get; set; }

		/// <summary>
		/// Gets or sets the year.
		/// </summary>
		/// <value>
		/// The year.
		/// </value>
		public short? Year { get; set; }

		/// <summary>
		/// Gets or sets the submission start date.
		/// </summary>
		/// <value>
		/// The submission start date.
		/// </value>
		public DateTime? SubmissionStartDate { get; set; }

		/// <summary>
		/// Gets or sets the submission end date.
		/// </summary>
		/// <value>
		/// The submission end date.
		/// </value>
		public DateTime? SubmissionEndDate { get; set; }
	}
}