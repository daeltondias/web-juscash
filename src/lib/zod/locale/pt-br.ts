import { ZodLocaleType } from '@/types/ZodLocaleType'

export const zodLocale: ZodLocaleType = {
  invalid_type:
    'Tipo inválido: esperado {issue.expected}, mas recebeu {issue.received}.',
  invalid_literal: 'Valor inválido, esperado: {issue.expected}.',
  unrecognized_keys: 'Chaves não reconhecidas: {issue.keys}.',
  invalid_union: 'Entrada inválida.',
  invalid_union_discriminator:
    'Discriminador de união inválido: esperado {issue.options}.',
  invalid_enum_value: 'Valor inválido. Esperado: {issue.options}.',
  invalid_arguments: 'Argumentos de função inválidos.',
  invalid_return_type: 'Tipo de retorno da função inválido.',
  invalid_date: 'Data inválida.',
  invalid_string: {
    email: 'E-mail inválido.',
    url: 'URL inválida.',
    uuid: 'UUID inválido.',
    regex: 'Formato inválido.',
    cuid: 'CUID inválido.',
    datetime: 'Data e hora inválidas.',
    // startsWith: 'Deve começar com "{issue.validation}".',
    // endsWith: 'Deve terminar com "{issue.validation}".',
  },
  too_small: {
    array: 'Deve ter no mínimo {issue.minimum} elemento(s).',
    string: 'Deve ter no mínimo {issue.minimum} caractere(s).',
    number: 'Deve ser maior ou igual a {issue.minimum}.',
  },
  too_big: {
    array: 'Deve ter no máximo {issue.maximum} elemento(s).',
    string: 'Deve ter no máximo {issue.maximum} caractere(s).',
    number: 'Deve ser menor ou igual a {issue.maximum}.',
  },
  custom: 'Erro personalizado: {issue.message}.',
  invalid_intersection_types: 'Interseção de tipos inválida.',
  not_multiple_of: 'O número deve ser múltiplo de {issue.multipleOf}.',
  not_finite: 'Número não finito.',
}
