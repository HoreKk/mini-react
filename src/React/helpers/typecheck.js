export default function type_check(variable, conf) {

  let check = []

  if (Object.prototype.hasOwnProperty.call(conf, 'value')) {
    check.push(JSON.stringify(variable) === JSON.stringify(conf.value))
  }

  if (Object.prototype.hasOwnProperty.call(conf, 'properties')) {
    for (const key of Object.keys(conf.properties)) {
      check.push(type_check(variable[key], conf.properties[key])) 
    }
  }

  if (Object.prototype.hasOwnProperty.call(conf, 'enum')) {
    check.push(conf.enum.some(item => {
      return JSON.stringify(variable) === JSON.stringify(item)
    }))
  }


  if (Object.prototype.hasOwnProperty.call(conf, 'type')) {
    if (variable === null) {
      check.push(conf.type === 'null')
    } else if (Array.isArray(variable)) {
      check.push(conf.type === 'array')
    } else {
      check.push(typeof variable === conf.type)
    }
  }

  return check.every(item => item)
}