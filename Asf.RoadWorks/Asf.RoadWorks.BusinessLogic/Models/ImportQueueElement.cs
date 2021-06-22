using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class ImportQueueElement
	{
		public long AuthorityId { get; set; }

		public Guid TenantId { get; set; }

		public long CompanyId { get; set; }

		public string ContainerName { get; set; }

		public string StoragePath { get; set; }

		public string FileExtension { get; set; }
	}
}