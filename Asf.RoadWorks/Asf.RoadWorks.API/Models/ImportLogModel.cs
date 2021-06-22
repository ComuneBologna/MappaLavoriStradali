using System;

namespace Asf.RoadWorks.API.Models
{
	/// <summary>
	/// Import log model
	/// </summary>
	public class ImportLogModel
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long Id { get; set; }

		/// <summary>
		/// Gets or sets the name of the company.
		/// </summary>
		/// <value>
		/// The name of the company.
		/// </value>
		public string CompanyName { get; set; }

		/// <summary>
		/// Gets or sets the migration date.
		/// </summary>
		/// <value>
		/// The migration date.
		/// </value>
		public DateTime MigrationDate { get; set; }

		/// <summary>
		/// Gets or sets the name of the file.
		/// </summary>
		/// <value>
		/// The name of the file.
		/// </value>
		public string FileName { get; set; }
	}
}