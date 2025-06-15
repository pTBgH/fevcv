"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Search, LogOut, User as UserIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signOut, useSession } from "next-auth/react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/lib/i18n/context";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { AppRoutes, mainNavLinks } from "@/lib/routes";
import { ServiceMenu } from "@/components/home/service-menu";

function SignInButton() {
	const iconRef = useRef<SVGSVGElement>(null);

	const handleMouseEnter = () => {
		if (iconRef.current) {
			// Lao lên và mờ dần
			iconRef.current.style.transform = 'translateY(-20px) translateX(8px)';
			iconRef.current.style.opacity = '0';
			// Sau 250ms, reset về vị trí cũ và hiện lại
			setTimeout(() => {
				if (iconRef.current) {
					iconRef.current.style.transition = 'none';
					iconRef.current.style.transform = 'translateY(20px) translateX(-8px)';
					iconRef.current.style.opacity = '0';
					// Sau đó animate trở về vị trí ban đầu
					setTimeout(() => {
						if (iconRef.current) {
							iconRef.current.style.transition = 'all 0.3s ease-out';
							iconRef.current.style.transform = 'translateY(0) translateX(0)';
							iconRef.current.style.opacity = '1';
						}
					}, 50);
				}
			}, 250);
		}
	};

	const handleMouseLeave = () => {
		if (iconRef.current) {
			iconRef.current.style.transform = 'translateY(0) translateX(0)';
			iconRef.current.style.opacity = '1';
			iconRef.current.style.transition = 'all 0.3s ease-out';
		}
	};

	return (
		<button
			onClick={() => signIn('keycloak')}
			className="bg-black text-white rounded-md pl-4 pr-2 py-2 flex items-center group transition-all duration-300 hover:bg-gray-800"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			Sign In
			<div className="ml-2 p-2 border border-white rounded-sm overflow-hidden">
				<ArrowUpRightIcon ref={iconRef} className="h-4 w-4 transition-all duration-300 ease-out" aria-hidden="true" />
			</div>
		</button>
	);
}

function UserMenu() {
	const { data: session } = useSession();
	const router = useRouter();

	if (!session?.user) return null;

	const fallbackName =
		session.user.name?.charAt(0).toUpperCase() ||
		session.user.email?.charAt(0).toUpperCase() ||
		"U";

	const handleMenuClick = (href: string) => {
		if (href === "#") {
			signOut({ callbackUrl: "/" });
		} else {
			router.push(href);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-700 text-sm">
					<Avatar className="h-10 w-10">
						<AvatarImage src={session.user.image || ''} alt={session.user.name || 'User Avatar'} />
						<AvatarFallback className="bg-black text-brand-cream text-xl">
							{fallbackName}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{session.user.name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{session.user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => handleMenuClick(AppRoutes.profiles)}>
					<UserIcon className="mr-2 h-4 w-4" />
					<span>Profile</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleMenuClick(AppRoutes.settings)}>
					<Settings className="mr-2 h-4 w-4" />
					<span>Settings</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => handleMenuClick("#")}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function MinimalNav() {
	const { data: session, status } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isHidden, setIsHidden] = useState(false);
	const lastScrollY = useRef(0);
	const { locale, setLocale, t } = useLanguage();

	// Restore scroll effect: Hide header when scrolling down past 100px
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
				setIsHidden(true);
			} else {
				setIsHidden(false);
			}
			lastScrollY.current = currentScrollY;
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const renderAuthComponent = () => {
		if (status === "loading") return <Skeleton className="h-10 w-28" />;
		if (status === "authenticated") return <UserMenu />;
		return <SignInButton />;
	};

	return (
		<>
			<header className={`bg-brand-background dark:bg-gray-900 py-4 sticky top-0 z-50 transition-all duration-300 transform ${isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between">
						<Link href={AppRoutes.home} className="text-3xl font-bold">
						VietCV
						</Link>
						{/* Desktop Navigation */}
						<nav className="hidden md:flex flex-1 justify-center items-center space-x-6">
							{mainNavLinks.map((link) => (
								<Link key={link.href} href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
									{t(`navigation.${link.labelKey}` as any) || link.labelKey}
								</Link>
							))}
							<form action={AppRoutes.search} method="get" className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input type="search" placeholder={t("navigation.searchJobs") as string} className="pl-10 pr-4 h-10 w-56 bg-brand-cream text-sm" />
							</form>
              				<ServiceMenu />
							<button onClick={() => setLocale(locale === "vi" ? "en" : "vi")} className="text-sm text-gray-600 hover:text-gray-900">
								{locale.toUpperCase()}
							</button>
						</nav>
						{/* Auth Component */}
						<div className="hidden md:block">{renderAuthComponent()}</div>
						{/* Mobile Menu Button */}
						<div className="md:hidden">
							<button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
								{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
							</button>
						</div>
					</div>
					{/* Mobile Menu */}
					{isMenuOpen && (
						<div className="md:hidden pt-4 pb-2">
							<div className="flex flex-col space-y-4">
								{mainNavLinks.map((link) => (
									<Link
										key={`mobile-${link.href}`}
										href={link.href}
										className="text-sm text-gray-600 hover:text-gray-900"
										onClick={() => setIsMenuOpen(false)}
									>
										{t(`navigation.${link.labelKey}` as any) || link.labelKey}
									</Link>
								))}
								<div className="pt-4 border-t border-gray-200">
									{renderAuthComponent()}
								</div>
							</div>
						</div>
					)}
				</div>
			</header>
		</>
	);
}
