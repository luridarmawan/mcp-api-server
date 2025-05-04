import { Elysia, t } from 'elysia'
import * as utils from '../../utils'

export default new Elysia({ prefix: '/employee' })
  .get('/', async () => {
    return {
      message: 'Employee service is running'
    }
  },{
    detail: {
      tags: ['Employee'],
      description: 'Prayer information',
      hide: true
    }
  })

  .get('/list', () => {
    const employeesAsText = utils.ReadFile('data/employee.json');
    const employees = JSON.parse(employeesAsText);
    return {
      success: true,
      data: employees
    }
  },{
    detail: {
      tags: ['Employee'],
      summary: 'Get employee list',
      description: 'Get employee list.',
    }
  })

  .get('/occupation/', ({query}) => {
    const employeesAsText = utils.ReadFile('data/occupation.json');
    let employees = JSON.parse(employeesAsText);
    const code = query?.code;
    if (code !== undefined){

      // SEARCH EMPLOYEE
      const employee = employees.find(emp => emp.employee_code === code.toUpperCase());
      if (employee){
        return {
            success: true,
            code: code,
            data: [ employee ]
          }    
      }else{
        return {
            success: false,
            message: 'Not Found'
        }
      }
    }
    return {
      success: true,
      code: code,
      data: employees
    }
  },{
    query: t.Object({
      code: t.Optional(t.String({ description: 'Employee code' })),
    }),
  detail: {
      tags: ['Employee'],
      summary: 'Get all employee occupations.',
      description: 'Retrieve the list of all employee occupations.',
    }
  })
