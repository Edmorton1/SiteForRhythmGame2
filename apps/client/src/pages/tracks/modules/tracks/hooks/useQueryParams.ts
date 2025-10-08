import { useSearchParams } from 'react-router-dom';

// type Key = (key: string) => void;
type KeyValue = (key: string, value: string) => void;

interface Methods {
	select: KeyValue;
	checkboxes: KeyValue;
}

export const useQueryParams = (): [URLSearchParams, Methods] => {
	const [searchParams, setSearchParams] = useSearchParams();

	console.log('searchParams', Array.from(searchParams.entries()));

	const methods: Methods = {
		select: (key, value) => {
			if (value === '') {
				setSearchParams(searchParams => {
					searchParams.delete(key);
					return searchParams;
				});
			} else {
				setSearchParams(searchParams => {
					searchParams.set(key, value);
					return searchParams;
				});
			}
		},
		checkboxes: (key, value) => {
			setSearchParams(searchParams => {
				if (searchParams.has(key, value)) {
					searchParams.delete(key, value);
				} else {
					searchParams.append(key, value);
				}

				return searchParams;
			});
		},
	};

	return [searchParams, methods];
};

// ! ПРОБЛЕМЫ:
// ! ОТПРАВЛЯЕТ ЛИШНИЕ И ПУСТЫЕ ПАРАМЕТРЫ
