import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { trans } from '@/lib/utils';



export default function ContactSection() {
    return (
        <section id="contact" className="py-12 md:py-20 bg-background dark:bg-background/70">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">{trans('contact_us_title')}</h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{trans('contact_us_subtitle')}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    <Card className="shadow-moroccan bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-6 md:p-8">
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary">{trans('contact_form_title')}</h3>
                            <form className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5 text-foreground">{trans('form_full_name')}</label>
                                    <Input id="contact-name" placeholder={trans('form_full_name_placeholder')} className="text-foreground" />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5 text-foreground">{trans('form_email')}</label>
                                    <Input id="contact-email" type="email" placeholder={trans('form_email_placeholder')} className="text-foreground" />
                                </div>
                                <div>
                                    <label htmlFor="contact-phone" className="block text-sm font-medium mb-1.5 text-foreground">{trans('form_phone')}</label>
                                    <Input id="contact-phone" placeholder={trans('form_phone_placeholder')} className="text-foreground" />
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5 text-foreground">{trans('form_message')}</label>
                                    <Textarea id="contact-message" placeholder={trans('form_message_placeholder')} rows={4} className="text-foreground resize-none" />
                                </div>
                                <Button type="submit" className="w-full moroccan-gradient text-white border-0 py-2.5 md:py-3 text-md hover:opacity-90 transition-opacity">
                                    {trans('form_send_message_button')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-6 md:space-y-8 rtl:text-right">
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary">{trans('contact_info_title')}</h3>
                            <div className="space-y-4 md:space-y-6">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3 flex-shrink-0">
                                        <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{trans('contact_email_label')}</p>
                                        <a href={`mailto:${trans('contact_email_value')}`} className="text-muted-foreground hover:text-primary transition-colors">{trans('contact_email_value')}</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3 flex-shrink-0">
                                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{trans('contact_phone_label')}</p>
                                        <a href={`tel:${trans('contact_phone_value')}`} className="text-muted-foreground hover:text-primary transition-colors">{trans('contact_phone_value')}</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center ltr:mr-3 rtl:ml-3 flex-shrink-0">
                                        <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{trans('contact_address_label')}</p>
                                        <p className="text-muted-foreground">{trans('contact_address_value')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Card className="bg-card/80 backdrop-blur-sm p-4 md:p-6 rounded-lg">
                            <h4 className="font-semibold text-foreground mb-3">{trans('contact_working_hours_title')}</h4>
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground">{trans('contact_hours_monday_friday')}</span>
                                    <span className="text-muted-foreground">{trans('contact_hours_monday_friday_time')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground">{trans('contact_hours_saturday')}</span>
                                    <span className="text-muted-foreground">{trans('contact_hours_saturday_time')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground">{trans('contact_hours_sunday')}</span>
                                    <span className="text-muted-foreground">{trans('contact_hours_sunday_time')}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
