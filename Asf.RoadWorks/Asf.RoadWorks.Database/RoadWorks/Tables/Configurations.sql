CREATE TABLE [RoadWorks].[Configurations]
(
	[Id] BIGINT IDENTITY(1,1) NOT NULL,
	[AuthorityId] BIGINT NOT NULL,
	[Year] SMALLINT NOT NULL,
	[SubmissionStartDate] DATETIME NOT NULL,
	[SubmissionEndDate] DATETIME NOT NULL,
	CONSTRAINT [PK_Configurations] PRIMARY KEY CLUSTERED ([Id] ASC)
)