import FontAwesome from '@expo/vector-icons/FontAwesome';

const NOTIFICATION_ICON_MAP: { [key: string]: React.ComponentProps<typeof FontAwesome>['name'] } = {
  'parabens': 'check-circle',
  'resumo_semana': 'exchange',
  'meta_atualizada': 'line-chart',
  'dica_economia': 'lightbulb-o',
  'relatorio_mensal': 'bar-chart',
  'alerta_despesa': 'warning',
  'default': 'bell-o', 
};

/**
 * @param tipo 
 * @returns 
 */
export const getIconForNotification = (tipo: string): React.ComponentProps<typeof FontAwesome>['name'] => {
  return NOTIFICATION_ICON_MAP[tipo] || NOTIFICATION_ICON_MAP['default'];
};