CREATE TABLE [Audit].[Works]
(
	[Id] BIGINT IDENTITY(1,1) NOT NULL,
	[WorkId] BIGINT NOT NULL,
	[DisplayName] NVARCHAR(64) NOT NULL,
	[LastUpdate] DATETIME NOT NULL,
	[AuditType] TINYINT NOT NULL,
	[BlobStoragePath] NVARCHAR(256) NULL,
	CONSTRAINT [PK_Works] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Works_Works] FOREIGN KEY ([WorkId]) REFERENCES [RoadWorks].[Works] ([Id])
)