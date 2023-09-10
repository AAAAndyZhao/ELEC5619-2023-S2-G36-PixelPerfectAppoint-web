const MenuUtils = {
    /*
    Binary representation of the multi menu code
    Parameters:
        menu: menu array defined in public.menu.js
        values: selected values, e.g. ['Model', 'Photographer']
    Return:
        binary representation of the multi menu code, e.g. 3
    */
    getMultiMenuCode: (menu, values) => {
        let result = 0;
        for (let i = 0; i < values.length; i++) {
          const index = menu.findIndex((item) => item.value === values[i])
          if (index === -1){
            console.error('unknown value', values[i])
            continue;
          }
          result += 1 << index;
        }
        return result;
    },
    /*
    Get multi menu selected array
    Parameters:
        menu: menu array defined in public.menu.js
        code: binary representation of the multi menu code, e.g. 3
    Return:
        selected array, e.g.
        [{
            code: 0,
            value: 'Model'
        }, {
            code: 1,
            value: 'Photographer'
        }]
    */
    getMultiMenuSelectedArray: (menu, code) => {
        const result = [];
        for (let i = 0; i < menu.length; i++) {
          if ((code & (1 << i)) !== 0) {
            result.push(menu[i]);
          }
        }
        return result;
    },
    
    /*
    get single menu code
    Parameters:
        menu: menu array defined in public.menu.js
        value: selected value, e.g. 'Model'
    Return:
        code of the single menu, e.g. 0
    */
    getSingleMenuCode: (menu, value) => {
        return menu.findIndex((item) => item.value === value)
    },

    /*
    get single menu selected value
    Parameters:
        menu: menu array defined in public.menu.js
        code: code of the single menu, e.g. 0
    Return:
        selected value object, e.g. { code: 0, value: 'Model' }
    */
    getSingleMenuSelectedValue: (menu, code) => {
        for (const item of menu) {
            if (item.code === code) {
                return item;
            }
        }
        return null;
    },
}

export default MenuUtils;