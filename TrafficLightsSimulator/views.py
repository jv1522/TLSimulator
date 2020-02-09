from django.views.generic import TemplateView

# Creating views here


class TLSHomePageView(TemplateView):
    template_name = 'base/base.html'