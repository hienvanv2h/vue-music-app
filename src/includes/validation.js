import {
  defineRule,
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  configure,
} from "vee-validate"
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  integer,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules"

export default {
  install(app) {
    app.component("VeeForm", VeeForm)
    app.component("VeeField", VeeField)
    app.component("ErrorMessage", ErrorMessage)

    // General rules
    defineRule("required", required)
    defineRule("min", min)
    defineRule("max", max)
    defineRule("alpha_spaces", alphaSpaces)
    defineRule("email", email)
    defineRule("integer", integer)
    defineRule("min_value", minValue)
    defineRule("max_value", maxValue)
    defineRule("excluded", excluded)

    // Specific rules
    defineRule("tos", required)
    defineRule("password_match", confirmed)
    defineRule("country_excluded", excluded)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          integer: `The field ${ctx.field} must be an integer.`,
          min_value: `The field ${ctx.field} cannot be less than ${ctx.rule?.params?.[0]}.`,
          max_value: `The field ${ctx.field} cannot be more than ${ctx.rule?.params?.[0]}.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded: `Due to restrictions, we do not accept users from this location.`,
          password_match: `The passwords don't match.`,
          tos: `You must accept the Terms of Service.`,
        }

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`

        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    })
  },
}
