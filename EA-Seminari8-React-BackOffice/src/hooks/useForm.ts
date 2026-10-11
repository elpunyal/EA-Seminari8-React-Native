import { useCallback, useReducer } from 'react';

// Tipos de valores que puede tener un campo de nuestro formulario
type FieldValue = string | boolean | string[] | number | undefined;
type FormValues = Record<string, FieldValue>;
type FormErrors<V> = Partial<Record<keyof V, string>>;

interface State<V> {
  values: V;
  touched: Partial<Record<keyof V, boolean>>;
}

type Action<V> =
  | { type: 'change'; name: keyof V; value: V[keyof V] }
  | { type: 'blur'; name: keyof V }
  | { type: 'touchAll' }
  | { type: 'fill'; values: Partial<V> }
  | { type: 'reset'; initialValues: V };

// Reducer simple para gestionar el estado del formulario en un único sitio
function reducer<V extends FormValues>(state: State<V>, action: Action<V>): State<V> {
  switch (action.type) {
    case 'change':
      return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'blur':
      return { ...state, touched: { ...state.touched, [action.name]: true } };
    case 'touchAll': {
      const touched: State<V>['touched'] = {};
      for (const name of Object.keys(state.values) as (keyof V)[]) {
        touched[name] = true;
      }
      return { ...state, touched };
    }
    case 'fill':
      return { ...state, values: { ...state.values, ...action.values } };
    case 'reset':
      return { values: action.initialValues, touched: {} };
  }
}

// Hook sencillo para formularios en React Native.
// Diferencia con React Web:
// En la web los inputs mandan un evento del navegador (e.target.value).
// En React Native NO hay navegador ni DOM: TextInput nos pasa directamente el texto
// escrito mediante onChangeText, por lo que creamos handleChangeText y setFieldValue.
export function useForm<V extends FormValues>(
  initialValues: V,
  validate: (values: V) => FormErrors<V>,
) {
  const [state, dispatch] = useReducer(reducer<V>, { values: initialValues, touched: {} });

  // Los errores se calculan a partir de los valores actuales
  const errors = validate(state.values);
  const isValid = Object.keys(errors).length === 0;

  // Cambiar el valor de un campo directamente (por ejemplo al tocar un botón o un switch)
  const setFieldValue = useCallback((name: keyof V, value: V[keyof V]) => {
    dispatch({ type: 'change', name, value });
  }, []);

  // Función pensada para el onChangeText del TextInput de React Native
  const handleChangeText = useCallback(
    (name: keyof V) => (text: string) => {
      dispatch({ type: 'change', name, value: text as V[keyof V] });
    },
    [],
  );

  // Cuando el usuario sale del input (onBlur), marcamos que ya lo ha tocado para mostrar el error
  const handleBlur = useCallback(
    (name: keyof V) => () => {
      dispatch({ type: 'blur', name });
    },
    [],
  );

  const touchAll = useCallback(() => dispatch({ type: 'touchAll' }), []);
  const fill = useCallback((values: Partial<V>) => dispatch({ type: 'fill', values }), []);
  const reset = useCallback(
    (values: V = initialValues) => dispatch({ type: 'reset', initialValues: values }),
    [initialValues],
  );

  return {
    values: state.values,
    errors,
    isValid,
    // Solo enseñamos el error si el usuario ya ha tocado el campo o si ha intentado guardar
    errorOf: (name: keyof V) => (state.touched[name] ? errors[name] : undefined),
    setFieldValue,
    handleChangeText,
    handleBlur,
    touchAll,
    fill,
    reset,
  };
}
