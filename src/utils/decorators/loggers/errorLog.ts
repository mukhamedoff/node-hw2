export function errorLog() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){
    const targetMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [req,,next] = args;
      try {
        const result = await targetMethod.apply(this, args);
        if(result?.error) {
          console.log(`Method: ${propertyKey};`);
          console.log(`Body:`, req.body);
          console.log(`Params:`, req.params);
          console.log(`Query:`, req.query);
          console.log(result.message);
          next();
        }
      } catch(err) {
        next(err);
      }
    }

    return descriptor;
  };
}