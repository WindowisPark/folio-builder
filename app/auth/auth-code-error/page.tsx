import Link from 'next/link'

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Authentication Error
                </h1>
                <p className="mt-6 text-base leading-7 text-slate-600">
                    Something went wrong while trying to sign you in.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/login"
                        className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Go back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
