class FestivalsHandler {
  constructor(festivalsService) {
    this._festivalsService = festivalsService;
  }

  async getFestivalsHandler() {
    const festivals = await this._festivalsService.getFestivals();

    return {
      status: 'success',
      message: 'list of festivals',
      data: {
        festivals,
      },
    };
  }

  async getFestivalByIdHandler(request) {
    const { id } = request.params;

    const festival = await this._festivalsService.getFestival(id);

    return {
      status: 'success',
      message: `festival of ${id}`,
      data: {
        festival,
      },
    };
  }
}

module.exports = FestivalsHandler;
