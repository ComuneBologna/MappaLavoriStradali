using System;
using System.Collections.Generic;

namespace Asf.RoadWorks.Functions.Models
{
	public class SystemEvent
	{
		public Guid Id { get; }

		public DateTimeOffset Timestamp { get; }

		public string Type { get; set; }

		public string Title { get; set; }

		public string Message { get; set; }

		public int? AuthorityId { get; set; }

		public string Payload { get; set; }

		public Guid TenantId { get; set; }

		public Dictionary<string, string> Properties { get; set; }

		public IEnumerable<string> Tags { get; set; }
	}
}