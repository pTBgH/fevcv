import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppRoutes } from "@/lib/routes";

export function ServiceMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="text-sm text-gray-600 hover:text-gray-900">
					Dịch vụ
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60 p-2">
				<DropdownMenuItem asChild>
					<Link href={AppRoutes.favoriteJobs}>Yêu thích công việc</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={AppRoutes.resumeEditor()}>Resume Editor</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={AppRoutes.resumeSuggestions()}>Resume Suggestions</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={AppRoutes.archivedJobs}>Archived Jobs</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
