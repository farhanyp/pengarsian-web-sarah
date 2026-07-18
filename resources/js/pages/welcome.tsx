import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col lg:max-w-3xl">
                        <div className="flex-1 rounded-lg bg-white p-8 lg:p-16 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-2 text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] text-center">
                                Visi
                            </h1>
                            <p className="mb-10 text-lg text-[#706f6c] dark:text-[#A1A09A] text-center">
                                Unggul di Bidang Pendidikan Umum dan Agama
                            </p>
                            
                            <h2 className="mb-6 text-xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] text-center">
                                Misi
                            </h2>
                            <ol className="flex flex-col gap-4 list-decimal pl-5 md:pl-10 text-base text-[#706f6c] dark:text-[#A1A09A]">
                                <li className="pl-2">
                                    Membentuk peserta didik yang cerdas dan terampil di bidang akademik dan non akademik.
                                </li>
                                <li className="pl-2">
                                    Menyelenggarakan pendidikan yang cinta Al-Quran dan berakhlak karimah.
                                </li>
                                <li className="pl-2">
                                    Membudayakan Pendidikan Al-Quran dengan menerapkan prinsip 5M, yaitu Membaca, Menghafal, Mengulang, Memahami dan Mengamalkan.
                                </li>
                                <li className="pl-2">
                                    Membentuk peserta didik yang rutin beribadah dan memiliki kepedulian sosial yang tinggi terhadap sesama.
                                </li>
                            </ol>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
