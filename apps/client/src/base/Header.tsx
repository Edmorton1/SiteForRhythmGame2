import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '../common/consts/NAMESPACES';
import { useInit } from '../common/hooks/useInit';
// ?: КОГДА БУДЕТ ФРОНТ, ВЕРНУТЬ
// import logo from '../assets/icons/logo.png';
// import SearchIcon from '@mui/icons-material/Search';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import Avatar from '@mui/material/Avatar';
// import flag from '../assets/icons/flag.webp';
// import testAvatar from '../assets/images/test_avatar.jpg';
// import style from './header.module.scss';
import { Link } from 'react-router-dom';
import { clientPaths } from '../common/consts/PATHS';
import { SUPPORTED_LANGUAGES } from '../common/consts/SUPPORTED_LANGUAGES';
import { LANGUAGE } from '../common/consts/LOCALSTORAGE';

// ?: КОГДА БУДЕТ ФРОНТ, ВЕРНУТЬ
// const {
// 	header,
// 	header__content,
// 	header__content__left,
// 	header__content__right,
// } = style;

export const Header = () => {
	const { t, i18n } = useTranslation(NAMESPACES.base);

	const changeLang = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	const { data } = useInit();
	console.log('SUPPORTED', SUPPORTED_LANGUAGES, LANGUAGE);

	return (
		<header>
			<nav style={{ display: 'flex', gap: '15px' }}>
				<Link to={clientPaths.home}>{t('nav.home')}</Link>
				<Link to={clientPaths.registration}>{t('nav.registration')}</Link>
				<Link to={clientPaths.login}>{t('nav.login')}</Link>
				<Link to={clientPaths.tracks}>tracks</Link>
			</nav>
			<div>Пользователь: {data ? data.name : 'Не авторизован'}</div>
			<select
				name='lang'
				defaultValue={LANGUAGE!}
				onChange={event => changeLang(event.target.value)}>
				{Object.keys(SUPPORTED_LANGUAGES).map(lang => (
					<option
						key={lang}
						value={lang}>
						{SUPPORTED_LANGUAGES[lang]}
					</option>
				))}
			</select>
		</header>
	);
};

// ?: ТЕСТОВЫЙ ФРОНТ
// <header>
// 	<nav style={{ display: 'flex', gap: '15px' }}>
// 		<Link to={clientPaths.home}>{t('nav.home')}</Link>
// 		<Link to={clientPaths.registration}>{t('nav.registration')}</Link>
// 		<Link to={clientPaths.login}>{t('nav.login')}</Link>
// 	</nav>
// 	<div>Пользователь: {data ? data.name : 'asd'}</div>
// 	<select
// 		name='lang'
// 		onChange={event => changeLang(event.target.value)}>
// 		<option value='en'>English</option>
// 		<option value='ru'>Русский</option>
// 	</select>
// </header>;

// ?: КОГДА БУДЕТ ФРОНТ, ВЕРНУТЬ
// <header className={header}>
// 	<div className={header__content}>
// 		<nav className={header__content__left}>
// 			<img
// 				src={logo}
// 				width={'70px'}
// 				height={'70px'}
// 				alt='logo'
// 			/>
// 			<a href='#'>главная</a>
// 			<a href='#'>треки</a>
// 			<a href='#'>рейтинг</a>
// 			<SearchIcon sx={{ height: '32px', width: '32px' }} />
// 		</nav>
// 		<nav className={header__content__right}>
// 			<FavoriteIcon sx={{ height: '32px', width: '32px' }} />
// 			<img
// 				src={flag}
// 				width='64px'
// 				height='32px'
// 				alt='flag'
// 			/>
// 			<Avatar
// 				sx={{ height: '70px', width: '70px' }}
// 				src={testAvatar}
// 			/>
// 		</nav>
// 	</div>
// </header>;
