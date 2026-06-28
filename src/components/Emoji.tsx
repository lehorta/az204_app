interface EmojiProps {
  symbol: string;
  label?: string;
}

/**
 * Componente para renderizar emojis de forma consistente
 * Usa emojis UTF-8 diretos para evitar problemas de encoding
 */
export const Emoji = ({ symbol, label }: EmojiProps) => {
  // Mapeamento de emojis comuns
  const emojis: Record<string, string> = {
    'bulb': '💡',        // Lâmpada
    'party': '🎉',       // Festa
    'lock': '🔒',        // Cadeado
    'key': '🔑',         // Chave
    'exit': '🚪',        // Porta
    'check': '✅',       // Check
    'warning': '⚠️',     // Aviso
    'fire': '🔥',        // Fogo
    'star': '⭐',        // Estrela
    'rocket': '🚀',      // Foguete
    'chart': '📊',       // Gráfico
    'money': '💰',       // Dinheiro
    'gym': '🏋️',        // Musculação
    'trophy': '🏆',      // Troféu
  };

  const emoji = emojis[symbol] || symbol;

  return (
    <span
      role="img"
      aria-label={label || symbol}
      className="emoji"
    >
      {emoji}
    </span>
  );
};
