namespace ChatbotApi.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }
}

public class BotNotFoundException : DomainException
{
    public BotNotFoundException(int id) : base($"Bot com ID {id} não encontrado.")
    {
    }
}

public class InvalidBotDataException : DomainException
{
    public InvalidBotDataException(string message) : base(message)
    {
    }
}

public class InvalidMessageDataException : DomainException
{
    public InvalidMessageDataException(string message) : base(message)
    {
    }
}
