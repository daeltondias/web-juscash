import { Overwrite } from './utils'
import { z } from 'zod'

type ZodIssueCode = Extract<z.ZodIssueCode, string>
type StringValidation = Extract<z.StringValidation, string>

export type ZodLocaleType = Overwrite<
  Record<ZodIssueCode, string>,
  {
    invalid_string: Partial<Record<StringValidation, string>>
    too_small: Partial<Record<z.ZodTooSmallIssue['type'], string>>
    too_big: Partial<Record<z.ZodTooBigIssue['type'], string>>
  }
>
