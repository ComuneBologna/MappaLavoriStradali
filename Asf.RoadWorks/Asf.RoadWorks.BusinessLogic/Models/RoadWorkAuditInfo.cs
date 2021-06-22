using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Roadworks audit info model
	/// </summary>
	public class RoadWorkAuditInfo
	{
		/// <summary>
		/// Gets or sets the created by.
		/// </summary>
		/// <value>
		/// The created by.
		/// </value>
		public string CreatedBy { get; set; }

		/// <summary>
		/// Gets or sets the created at.
		/// </summary>
		/// <value>
		/// The created at.
		/// </value>
		public DateTime? CreatedAt { get; set; }

		/// <summary>
		/// Gets or sets the updated by.
		/// </summary>
		/// <value>
		/// The updated by.
		/// </value>
		public string UpdatedBy { get; set; }

		/// <summary>
		/// Gets or sets the last update.
		/// </summary>
		/// <value>
		/// The last update.
		/// </value>
		public DateTime? LastUpdate { get; set; }
	}
}